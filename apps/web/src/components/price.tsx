import { Product } from "@/features/products/schemas/products.zod";
import { getProductPrice } from "@/lib/helpers";
import { cn } from "@/lib/utils";

type Currency = "USD" | "LKR" | "GBP" | "JPY" | "CNY";

export function formatPrice(
  amount: number,
  currency: Currency,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// export function Price({
//   amount,
//   currency,
//   locale,
//   className
// }: {
//   amount: number;
//   currency: Currency;
//   locale?: string;
//   className?: string;
// }) {
//   return (
//     <span className={cn("", className)}>
//       {formatPrice(amount, currency, locale)}
//     </span>
//   );
// }

interface ProductPriceProps {
  product: Product;
  className?: string;
}

export function ProductPrice({ product, className }: ProductPriceProps) {
  const price = getProductPrice(product);

  if (price.hasVariants) {
    return (
      <span className={cn("text-lg font-semibold", className)}>
        <span className="text-xs font-normal">From</span>{" "}
        <span className="">{formatPrice(price.price.min, "LKR")}</span>
      </span>
    );
  }

  return (
    <span className={cn("text-lg font-semibold", className)}>
      {formatPrice(price.price, "LKR")}
    </span>
  );
}
