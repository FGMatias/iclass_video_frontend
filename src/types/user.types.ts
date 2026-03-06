export interface UserResponse {
    id: number
    username: string
    name: string
    paternalSurname: string
    maternalSurname: string
    email: string | null
    phone: string | null
    documentNumber: string | null
    roleId: number
    roleName: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateCompanyAdminRequest {
    companyId: number
    username: string
    name: string
    paternalSurname?: string
    maternalSurname?: string
    documentNumber?: string
    email: string
    phone?: string
}

export interface UpdateUserRequest {
    username?: string
    name?: string
    paternalSurname?: string
    maternalSurname?: string
    documentNumber?: string
    email?: string
    phone?: string
}

export const 