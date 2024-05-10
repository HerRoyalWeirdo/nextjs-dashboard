//these are server functions
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
  });
    
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
//since fields not of teh same name there

export async function createInvoice(formData: FormData) {
    // const rawFormData = {
    const { customerId, amount, status } = CreateInvoice.parse({
        //get input name field ^ validation of fields
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    }
);

const amountInCents = amount * 100;
const date = new Date().toISOString().split('T')[0];
// "YYYY-MM-DD"

//insert new invoice + pass variables
await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  //updating data so clear cache and send new request to server
  redirect('/dashboard/invoices');
  //after validating send back to invoices page after create
}

export async function updateInvoice(id: string, formData: FormData) {
    console.log('ipate')
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}

//Tip: If you're working with forms that have many fields, you may want to consider using 
//the entries() method with JavaScript's Object.fromEntries(). For example:
// const rawFormData = Object.fromEntries(formData.entries())

// Test it out:
// console.log('form raw', rawFormData);
// console.log('type form', typeof rawFormData.amount);

// form raw {
//     customerId: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
//     amount: '12.0',
//     status: 'pending'
//   }
//   type form string

// console.log('id', customerId);
// console.log('amonnt', amount);
// console.log('status', status);

// id cc27c14a-0acf-4f4a-a6c9-d45682c144b9
// amonnt 55
// status pending