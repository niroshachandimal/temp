import { apiClient } from '../api';
import { Path } from '../api/backendUrl';
import { FetchSearchDataParams, FetchSearchDataResponse } from '../utils/type';

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;

// }

export const SendLocation = async () => {
  console.log('SendLocation');
  const ipInfo = await fetchIPInfo();
  console.log(ipInfo);
  if (ipInfo.country.name === 'Canada') {
    const queryParams = new URLSearchParams({
      country: ipInfo.country.name,
    }).toString();
    const res = await apiClient.get(`${Path.sendlocation}?${queryParams}`);
    const data = {
      resData: res.data, // You can name it anything you want
      state: ipInfo.state.name,
    };

    return data;
  }
  return null;
  //   return res.data
};

export const fetchSearchData = async (
  params: FetchSearchDataParams
): Promise<FetchSearchDataResponse> => {
  const { filter } = params;
  const queryParams = new URLSearchParams(filter).toString();

  const res = await apiClient.get(`${Path.getSearchResult}?${queryParams}`);
  return res.data; // Adjust based on your API response
};

// export const fetchSearchData = async ({
//   // pageParam,
//   // search,
//   filter
// }: FetchSearchDataParams): Promise<FetchSearchDataResponse> => {
//   console.log('Filter:', filter);

//   const queryParams = new URLSearchParams({
//     ...filter
//   }).toString();
// console.info('Query Params:', queryParams);
//   // Make the API request
//   const res = await apiClient.get(`${Path.getSearchResult}?${queryParams}`);

//   // Return the posts from the response (adjust based on the actual response structure)
//   return res?.data;
// };

const fetchIPInfo = async () => {
  const response = await fetch(
    `https://api.geoapify.com/v1/ipinfo?apiKey=${import.meta.env.VITE_APP_GEOPIFY_APIKEY}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch IP information');
  }
  const data = await response.json();

  if (!data.location) {
    throw new Error('No location data found');
  }

  return data;
};
