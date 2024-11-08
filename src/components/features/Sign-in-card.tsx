import * as z from "zod";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  Form,
  FormControl,
  
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1,"Please enter your password"),
});

export default function SignInCard ()  {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit =(values:z.infer<typeof formSchema>)=>{
console.log(values);


}

  return (
    <Card className="w-full h-full md:w-[487px] ">
      <CardHeader className="flex items-center justify-center text-center p-7 ">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7 ">



      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Input
                  className="outline-none"
                    type="email"
                    placeholder="Enter email adress"
                    {...field}
                  />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Input
                  className="outline-none"
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button  disabled={false} size="lg" className="bg-orange-500 hover:bg-orange-500/70 w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">



      </div>
    
    </Card>
  );
};
