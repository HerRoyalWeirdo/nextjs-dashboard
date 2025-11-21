import { fell } from '@/app/ui/fonts';
import CustomersTable from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';

export default async function Page() {
const query = '';
  const [customers] = await Promise.all([
          fetchFilteredCustomers(query),
        ]);
    return (
    <main>
      <strong><h1 className={`${fell.className} text-cyan-500 mb-4 text-xl md:text-2xl`}> Customers Page </h1></strong>

      <CustomersTable customers={customers}/>
    </main>
    )
  }
  //sorta working cause im not going to finish this course with the use action state issues