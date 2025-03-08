// import showToaster from 'components/Toaster/Toaster';
// import {
//   errorMessage,
//   errorr,
//   success,
// } from 'components/Toaster/ToasterMassage';
import axios from 'axios';
import { NextRouter, useRouter } from 'next/router';
import { logout } from 'redux/reducer/Login';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const API_BASE_URL = process.env.NEXT_PUBLIC_IMS_URL;
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

interface ApiFeatureType {
  config?: { dispatch: Dispatch<AnyAction>; router: NextRouter } | null;
  get?: any;
  post?: any;
  put?: any;
  delete?: any;
}
const ApiHandler: ApiFeatureType = {
  config: null,
  get: async (
    path: string,
    token: string | null = null,
    id: number | null = null
  ) => {
    try {
      const fullPath = id ? `${path}/${id}` : path;
      const response = await axiosInstance.get(fullPath, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response?.data?.status === 401) {
        const context = ApiHandler.config;
        context?.dispatch(logout());
        context?.router?.push('/login');
      }
      return response?.data?.data;
    } catch (error: any) {
      showToaster(errorr, error?.response?.data?.message);
    }
  },

  post: async (
    path: string,
    data: any,
    token: string | null = null,
    isMultipart = false,
    showToast = true
  ) => {
    try {
      const response = await axiosInstance.post(path, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': isMultipart
            ? 'multipart/form-data'
            : 'application/json',
        },
      });
      if (showToast && response?.data?.success) {
        showToaster(success, response?.data?.message);
      } else if (response?.data?.status === 401) {
        const context = ApiHandler.config;
        context?.dispatch(logout());
        context?.router?.push('/login');
      }
      return response?.data;
    } catch (error: any) {
      showToaster(errorr, error?.response?.data?.message);
      return error;
    }
  },

  put: async (
    path: string,
    data: any,
    token: string | null = null,
    id: number | null = null,
    isMultipart: boolean = false
  ) => {
    try {
      const fullPath = id ? `${path}/${id}` : path;
      const response = await axiosInstance.put(fullPath, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': isMultipart
            ? 'multipart/form-data'
            : 'application/json',
        },
      });
       if (response?.data?.status === 401) {
        const context = ApiHandler.config;
        context?.dispatch(logout());
        context?.router?.push('/login');
      }
      else if (response.data && response.data.success) {
        showToaster(success, response.data.message);
      
      } 
     else {
        showToaster(errorMessage, 'Failed to update');
      }
      return response.data;
    } catch (error: any) {
      showToaster(errorr, error?.response?.data?.message);
    }
  },

  delete: async (path: string, token: string | null = null) => {
    try {
      const response = await axiosInstance.delete(path, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
   
      if (response?.data?.status === 401) {
        const context = ApiHandler.config;
        context?.dispatch(logout());
        context?.router?.push('/login');
      }
      else if (response.data && response.data.success) {
        showToaster(success, response.data.message);
      
      } 
     else {
        showToaster(errorMessage, 'Failed to update');
      }
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        showToaster(errorr, 'Authentication failed.');
      } else {
        showToaster(errorr, error?.response?.data?.message);
      }
    }
  },
};

export default ApiHandler;