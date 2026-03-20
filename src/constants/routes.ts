export const ROUTES = {
  LOGIN: '/login',
  ADMINISTRATOR: {
    USER: '/usuario',
    COMPANY: '/empresa',
    COMPANY_DETAIL: '/empresa/:id',
    CONFIGURATION: '/configuracion',
  },
  COMPANY_ADMINISTRATOR: {
    USER: '/empresa/usuario',
    BRANCH: '/empresa/sucursal',
    BRANCH_DETAIL: '/empresa/sucursal/:id',
    AREA_DETAIL: '/empresa/sucursal/:id/area/:id',
    VIDEO: '/empresa/video',
  },
  BRANCH_ADMINISTRATOR: {
    VIDEO: '/sucursal/video',
    AREA: '/sucursal/area',
    AREA_DETAIL: '/sucursal/area/:id',
    DEVICE: '/sucursal/dispositivo',
    CONFIGURATION: '/sucursal/configuracion',
  },
} as const
