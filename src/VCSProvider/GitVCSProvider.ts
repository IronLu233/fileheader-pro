import dayjs, { Dayjs } from "dayjs";
import { NoVCSProviderError } from "../Error/NoVCSProviderError";
import { exec, getFirstLine } from "../Utils";
import { BaseVCSProvider } from "./BaseVCSProvider";

export class GitVCSProvider implements BaseVCSProvider {
  async validate(repoPath: string): Promise<void> {
    try {
      await exec("git status", { cwd: repoPath });
    } catch (error) {
      throw new NoVCSProviderError((error as Error).message);
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
      if (!userName) {
        throw new Error("You should set user.name in git config first");
      }
      return getFirstLine(userName);
    } catch (e) {
      throw e;
    }
  }
  async getUserEmail(repoPath: string): Promise<string> {
    try {
      const userEmail = await exec(`git config user.email`, { cwd: repoPath });
      if (!userEmail) {
        throw new Error("You should set user.email in git config first");
      }
      return getFirstLine(userEmail);
    } catch (error) {
      throw error;
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
