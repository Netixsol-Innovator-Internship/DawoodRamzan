import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Bidder {
  id: string
  name: string
  amount: number
}

interface BiddersListProps {
  bidders: Bidder[]
}

export function BiddersList({ bidders }: BiddersListProps) {
  return (
    <Card>
      <CardHeader className="bg-[#4A5AAF] text-white">
        <CardTitle>Bidders List</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {bidders.map((bidder, index) => (
            <div
              key={bidder.id}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#4A5AAF]">Bidder {index + 1}</span>
                <span className="text-sm text-gray-600">{bidder.name}</span>
              </div>
              <span className="text-sm font-semibold">${bidder.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
