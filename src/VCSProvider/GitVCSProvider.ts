import dayjs, { Dayjs } from "dayjs";
import { dirname } from "path";
import { CommandExecError } from "../Error/CommandExecError";
import { MissUserNameEmailError } from "../Error/MissUserNameEmailError";
import { NoVCSProviderError } from "../Error/NoVCSProviderError";
import { exec, getFirstLine } from "../Utils";
import { BaseVCSProvider } from "./BaseVCSProvider";

export class GitVCSProvider implements BaseVCSProvider {
  async validate(repoPath: string): Promise<void> {
    try {
      await exec("git status", { cwd: repoPath });
    } catch (error) {
      throw new NoVCSProviderError("Please init git via `git init` first.");
    }
  }
  async getAuthorName(filePath: string): Promise<string> {
    try {
      const authors = await exec(
        `git --no-pager log --format='%aN' --follow --reverse ${filePath}`,
        { cwd: dirname(filePath) }
      );
      // TODO: find out why std out have extra `'`
      return getFirstLine(authors).replace(/'/g, "");
    } catch (error) {
      throw error;
    }
  }
  async getAuthorEmail(filePath: string): Promise<string> {
    try {
      const emails = await exec(
        `git --no-pager log --format='%aE' --follow --reverse ${filePath}`,
        { cwd: dirname(filePath) }
      );
      return getFirstLine(emails).replace(/'/g, "");
    } catch (error) {
      throw error;
    }
  }
  async getUserName(repoPath: string): Promise<string> {
    try {
      const userName = await exec(`git config user.name`, { cwd: repoPath });
      return getFirstLine(userName);
    } catch (e) {
      if (e instanceof CommandExecError) {
        throw new MissUserNameEmailError(
          `You should set user.name in git config first.
Set your username via 'git config user.name "your username"'`
        );
      }
      throw e;
    }
  }
  async getUserEmail(repoPath: string): Promise<string> {
    try {
      const userEmail = await exec(`git config user.email`, { cwd: repoPath });
      return getFirstLine(userEmail);
    } catch (e) {
      if (e instanceof CommandExecError) {
        throw new MissUserNameEmailError(
          `You should set user.email in git config first.
Set your username via 'git config user.email "your Email"'`
        );
      }
      throw e;
    }
  }
  async getBirthtime(filePath: string): Promise<Dayjs> {
    try {
      const isoTimes = await exec(
        `git --no-pager log --format='%ai' --follow --reverse ${filePath}`,
        { cwd: dirname(filePath) }
      );

      const ctimeISO = getFirstLine(isoTimes).replace(/'/g, "");

      return dayjs(ctimeISO);
    } catch (error) {
      throw error;
    }
  }

  async isTracked(filePath: string): Promise<boolean> {
    try {
      const result = await exec(`git ls-files ${filePath}`, {
        cwd: dirname(filePath),
      });
      return !!result;
    } catch {
      return false;
    }
  }

  async hasChanged(filePath: string): Promise<boolean> {
    try {
      const result = await exec(`git status --porcelain ${filePath}`, {
        cwd: dirname(filePath),
      });
      return !!result && !result.replace(/'/g, '').startsWith("M");
    } catch {
      return false;
    }
  }
}
