import dayjs, { Dayjs } from "dayjs";
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
        `git --no-pager log --format='%aN' --follow --reverse ${filePath}`
      );
      return getFirstLine(authors);
    } catch (error) {
      throw error;
    }
  }
  async getAuthorEmail(filePath: string): Promise<string> {
    try {
      const emails = await exec(
        `git --no-pager log --format='%aE' --follow --reverse ${filePath}`
      );
      return getFirstLine(emails);
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
  async getCtime(filePath: string): Promise<Dayjs> {
    try {
      const authors = await exec(
        `git --no-pager log --format='%at' --follow --reverse ${filePath}`
      );
      const cTimestamp = Number.parseInt(getFirstLine(authors));
      return dayjs(cTimestamp);
    } catch (error) {
      throw error;
    }
  }
}
