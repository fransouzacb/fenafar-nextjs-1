## Error Type
Runtime Error

## Error Message
A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.


    at SelectItem (src/components/ui/select.tsx:107:5)
    at ConvitesPage (src/app/(dashboard)/convites/page.tsx:295:13)

## Code Frame
  105 | }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  106 |   return (
> 107 |     <SelectPrimitive.Item
      |     ^
  108 |       data-slot="select-item"
  109 |       className={cn(
  110 |         "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",

Next.js version: 15.5.3 (Turbopack)
sindicato@teste.local


## Error Type
Runtime TypeError

## Error Message
sindicatos.map is not a function


    at MembrosPage (src/app/(dashboard)/membros/page.tsx:391:31)

## Code Frame
  389 |                 <SelectContent>
  390 |                   <SelectItem value="all">Todos os Sindicatos</SelectItem>
> 391 |                   {sindicatos.map(sindicato => (
      |                               ^
  392 |                     <SelectItem key={sindicato.id} value={sindicato.id}>
  393 |                       {sindicato.name}
  394 |                     </SelectItem>

Next.js version: 15.5.3 (Turbopack)
