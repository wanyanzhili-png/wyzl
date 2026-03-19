import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  slug?: string
}

export default function ProductCard({ id, name, price, image, slug }: ProductCardProps) {
  return (
    <Link href={`/product/${slug || id}`} className="group">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square relative bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{name}</h3>
          <p className="text-primary font-bold">{formatPrice(price)}</p>
        </div>
      </div>
    </Link>
  )
}
