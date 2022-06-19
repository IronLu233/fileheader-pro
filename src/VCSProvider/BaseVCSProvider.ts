import { Dayjs } from "dayjs";

export interface BaseVCSProvider {
  /**
   * validate can use this CVSProvider
   */
  validate(repoPath: string): Promise<void>;

  /**
   * get the author name of a file from the VCS
   */
  getAuthorName(filePath: string): Promise<string>;
  /**
   * get the author email of a file from the VCS
   */
  getAuthorEmail(filePath: string): Promise<string>;

  /**
   * get current user name from the VCS
   */
  getUserName(repoPath: string): Promise<string>;

  /**
   * get current user email from the VCS
   */
  getUserEmail(repoPath: string): Promise<string>;

  /**
   * get file creation time from the VCS
   * @param filePath the file path
   */
  getCtime(filePath: string): Promise<Dayjs>;
}
