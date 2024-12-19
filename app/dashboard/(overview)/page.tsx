import { unifrakturCook } from '@/app/ui/fonts';
import { Card } from '@/app/ui/dashboard/cards';
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices'
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton,  LatestInvoicesSkeleton, 
  CardsSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  // const revenue = await fetchRevenue();
  // const latestInvoices = await fetchLatestInvoices();
  const cardData = await fetchCardData();
  //chapter 7 - async each one wait
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();
  // console.log(cardData.numberOfCustomers)
  // console.log('rev:', revenue);

  //can use promise for parallel
  // const data = await Promise.all([
  //   invoiceCountPromise,
  //   customerCountPromise,
  //   invoiceStatusPromise,
  // ]);

    return (
      <main>
        <strong><p className={`${unifrakturCook.className} text-purple-500 mb-4 text-xl md:text-2xl`}> Dashboard Page </p></strong>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={cardData.totalPaidInvoices} type="collected" />
        <Card title="Pending" value={cardData.totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={cardData.numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={cardData.numberOfCustomers}
          type="customers"
        /> */}
        {/* the 4 top cards */}
        {/* suspense will wait until its loaded to display, skeleton while loading - chapter 9 */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
       
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        {/* <RevenueChart revenue={revenue}  /> */}
        
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>

      </main>  
  )
  }