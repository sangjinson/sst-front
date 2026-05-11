import * as React from "react"
import { ChevronRight, MoreHorizontal } from "lucide-react" // 필요한 경우 lucide-react 설치

// 전체 컨테이너
const Breadcrumb = React.forwardRef(({ ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
))
Breadcrumb.displayName = "Breadcrumb"

// 리스트 (ol)
const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={`flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500 sm:gap-2.5 dark:text-gray-400 ${className}`}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

// 개별 아이템 (li)
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={`inline-flex items-center gap-1.5 ${className}`}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

// 링크 (a 혹은 React Router의 Link로 변경 가능)
const BreadcrumbLink = React.forwardRef(({ className, href, ...props }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      className={`transition-colors hover:text-gray-900 dark:hover:text-gray-50 ${className}`}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

// 현재 페이지 (span)
const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={`font-normal text-gray-950 dark:text-gray-50 ${className}`}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

// 구분선 (Separator)
const BreadcrumbSeparator = ({ children, className, ...props }) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={`[&>svg]:size-3.5 ${className}`}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

// 생략 기호 (Ellipsis) - 필요한 경우 사용
const BreadcrumbEllipsis = ({ className, ...props }) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={`flex h-9 w-9 items-center justify-center ${className}`}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}