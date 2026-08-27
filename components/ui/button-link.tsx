import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

const isExternal = (href: string) =>
  /^(https?:|tel:|mailto:)/.test(href);

/**
 * A Link/anchor styled as a Button. Base UI's Button takes a `render`
 * element rather than Radix's `asChild`, so this wraps that pattern once
 * instead of repeating it at every call site.
 */
export function ButtonLink({
  href,
  children,
  className,
  variant,
  size,
  target,
  rel,
  ...rest
}: ButtonLinkProps) {
  const external = isExternal(href);
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        external ? (
          <a href={href} target={target} rel={rel} {...rest} />
        ) : (
          <Link href={href} {...rest} />
        )
      }
    >
      {children}
    </Button>
  );
}
