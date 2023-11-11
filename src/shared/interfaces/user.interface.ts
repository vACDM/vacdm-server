interface User {
  cid: number;

  firstName: string;
  lastName: string;

  /** has any rating other than SUS or OBS */
  hasAtcRating: boolean;

  access_token?: string;
  refresh_token?: string;

  roles: string[];
  banned: boolean;
}

export default User;
