/**
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-19 11:06:08
 */
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
   * get file birth time from the VCS
   * @param filePath the file path
   */
  getBirthtime(filePath: string): Promise<Dayjs>;

  /**
   * get the result whether the file is tracked by VCS
   */
  isTracked(filePath: string): Promise<boolean>;

  hasChanged(filePath: string): Promise<boolean>;
}
