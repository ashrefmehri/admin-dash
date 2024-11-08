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
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";


const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1,"Please enter your password"),
});

export default function SignInCard ()  {

  const { login, loading, error,user } = useAuth();

  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
        navigate('/dashboard');
    }
}, [user, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit = async (values:z.infer<typeof formSchema>)=>{
  const { email, password } = values
  await login(email,password)


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
            <Button  disabled={loading} size="lg" className="bg-orange-500 hover:bg-orange-500/70 w-full">
            {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">

      {error && <p style={{ color: 'red' }}>{error}</p>}


      </div>
    
    </Card>
  );
};
