// lib/services/cvApi.ts
import { api } from "../api";

export interface CV {
  _id: string;
  title: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    website?: string;
  };
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }[];
  skills: {
    name: string;
    level: number;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];
  languages: { language: string; proficiency: string }[];
  certifications: { name: string; issuer: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export const cvApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCVs: builder.query<CV[], void>({
      query: () => "/cv",
      providesTags: ["CV"],
    }),
    getCVById: builder.query<CV, string>({
      query: (id) => `/cv/${id}`,
      providesTags: (result, error, id) => [{ type: "CV", id }],
    }),
    createCV: builder.mutation<CV, Partial<CV>>({
      query: (body) => ({
        url: "/cv",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CV"],
    }),
    updateCV: builder.mutation<CV, { id: string; data: Partial<CV> }>({
      query: ({ id, data }) => ({
        url: `/cv/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "CV", id }],
    }),
    deleteCV: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/cv/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CV"],
    }),
    exportPDF: builder.query<Blob, string>({
      query: (id) => ({
        url: `/cv/${id}/export/pdf`,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportDOCX: builder.query<Blob, string>({
      query: (id) => ({
        url: `/cv/${id}/export/docx`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetCVsQuery,
  useGetCVByIdQuery,
  useCreateCVMutation,
  useUpdateCVMutation,
  useDeleteCVMutation,
  useLazyExportPDFQuery,
  useLazyExportDOCXQuery,
} = cvApi;
