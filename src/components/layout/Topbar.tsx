import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTheme } from '@/hooks/useTheme'
import { useBreadcrumbStore } from '@/stores/breadcrumb.store'
import { Moon, Sun } from 'lucide-react'
import React from 'react'
import { Link, useMatches } from 'react-router-dom'

interface RouteHandle {
  group?: string
  title?: string
}

export function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const matches = useMatches()
  const customBreadcrumbs = useBreadcrumbStore((state) => state.customBreadcrumbs)
  const currentRoute = matches[matches.length - 1]
  const matchHandle = currentRoute?.handle as RouteHandle | undefined
  const groupName = matchHandle?.group || ''
  const pageName = matchHandle?.title || ''

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {groupName && (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink className="capitalize">{groupName.toLowerCase()}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
          {customBreadcrumbs ? (
            customBreadcrumbs.map((crumb, index) => {
              const isLast = index === customBreadcrumbs.length - 1
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {!isLast && crumb.path ? (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.path}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </div>
    </header>
  )
}
