import contactInfo from '@/lib/contactInfo';

export async function GET() {
  return Response.json(contactInfo);
}
