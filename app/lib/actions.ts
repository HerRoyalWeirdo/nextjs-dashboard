//these are server functions - chapter 12
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { error } from 'console';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({ //chapter 14 validation zod
      invalid_type_error: 'Please select valid customer.',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter minimum amount of $0'}),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select a valid status.',
    }),
    date: z.string(),
  });
    
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
//since fields not of teh same name there

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(State: State, formData: FormData) {
    // const rawFormData = {
    try {
      //const { customerId, amount, status } = CreateInvoice.parse({
              //get input name field ^ validation of fields
        const validatedFields = CreateInvoice.safeParse({
              customerId: formData.get('customerId'),
              amount: formData.get('amount'),
              status: formData.get('status'),
          }
      );
      //console.log(rawFormData);
      //console.log(typeof rawFormData.amount);
console.log(validatedFields);
      //chapter 14 - return errors early
      if (!validatedFields.success){
        return{
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. createInvoice Error.',
        };
      }

      const { customerId, amount, status } = validatedFields?.data;
//prepare data insert database
      const amountInCents = amount * 100; //validatedFields?.data?.amount * 100;
      const date = new Date().toISOString().split('T')[0];
      // "YYYY-MM-DD" format

      //insert new invoice + pass variables
      try{//hm on the sql in try catch yolo
await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
      } catch(error){
console.log('CreateInvoice: Database Error.')
      }
      
    } 
    catch(e) {
      console.log('createInvoice Error: ', e);
    }
    
    console.log('createInvoice Success');
      revalidatePath('/dashboard/invoices');
      //updating data so clear cache and send new request to server
      redirect('/dashboard/invoices');
      //after validating send back to invoices page after create
    
}

export async function updateInvoice(id: string, formData: FormData): Promise<State> {
    console.log('update invoice action')
    //const { customerId, amount, status } = UpdateInvoice.parse({
    const validatedUpdateFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedUpdateFields.success){
        return{
          errors: validatedUpdateFields.error.flatten().fieldErrors,
          message: 'Missing Fields. updateInvoice Error.',
        };
      }

    const { customerId, amount, status } = validatedUpdateFields?.data;
    const amountInCents = amount * 100;
   
    try {
      await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
      revalidatePath('/dashboard/invoices');
        console.log('updateInvoice Success');
    }
    catch (e){
      console.log('updateInvoice Error: ', e);
      return {
      message: 'Database update failed.',
      errors: {},
    };
    }
   
    redirect('/dashboard/invoices');
    //redirect outside block as it calls error
    //but revalidte is fine inside - chapter 13
}

export async function deleteInvoice(id: string) {
//throw new Error('Failed deleteInvoice'); //for testing
  try { 
    await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
      console.log('deleteInvoice Sucesses');
    }
  catch(e) {
    console.log('deleteInvoice Error: ', e);
  }

   
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