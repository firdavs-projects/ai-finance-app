import { baseApi, ApiTags, ApiMethods, ApiEndpoints, getUrl } from '@shared/api'

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
  parentId?: string
}

export interface CreateCategoryDto {
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
  parentId?: string
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ApiEndpoints.CATEGORIES,
      providesTags: [ApiTags.CATEGORIES],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => getUrl(ApiEndpoints.CATEGORY_BY_ID, { id }),
      providesTags: (_result, _error, id) => [{ type: ApiTags.CATEGORIES, id }],
    }),
    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (body) => ({
        url: ApiEndpoints.CATEGORIES,
        method: ApiMethods.POST,
        body,
      }),
      invalidatesTags: [ApiTags.CATEGORIES],
    }),
    updateCategory: builder.mutation<Category, { id: string; data: Partial<CreateCategoryDto> }>({
      query: ({ id, data }) => ({
        url: getUrl(ApiEndpoints.CATEGORY_BY_ID, { id }),
        method: ApiMethods.PATCH,
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: ApiTags.CATEGORIES, id }, ApiTags.CATEGORIES],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: getUrl(ApiEndpoints.CATEGORY_BY_ID, { id }),
        method: ApiMethods.DELETE,
      }),
      invalidatesTags: [ApiTags.CATEGORIES],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi

