interface User {
  apidata: {
    cid: string;
    personal: {
      name_first: string;
      name_last: string;
      name_full: string;
      email: string;
      country: {
        id: string;
        name: string;
      };
    };
  };

  vatsim: {
    rating: LongVatsimDetails;
    pilotrating: LongVatsimDetails;
    division: ShortVatsimDetails;
    region: ShortVatsimDetails;
    subdivision: ShortVatsimDetails;
  };

  access_token?: string;
  refresh_token?: string;

  vacdm: {
    admin: boolean;
    atc: boolean;
    banned: boolean;
  }
}

export interface LongVatsimDetails {
  id: number;
  long: string;
  short: string;
}

export interface ShortVatsimDetails {
  id: number;
  name: string;
}

export default User;
