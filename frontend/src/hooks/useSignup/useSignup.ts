import { useState } from "react"
import { IError, ISignupForm } from "~/@types";
import { IRequestParams } from "~/@types/services/http";
import { Api } from "~/services";
import { sanitize } from "~/utils";
import { registerSchema } from "~/validators";

export function useSignup() {
  
  const [form, setForm] = useState<ISignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IError>({
    error: false,
    message: ""
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case "name":
        setForm({
          name: event.target.value,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword, 
        })
        break;
      case "email":
        setForm({
          name: form.name,
          email: event.target.value,
          password: form.password,
          confirmPassword: form.confirmPassword, 
        });
        break;
      case "password":
        setForm({
          name: form.name,
          email: form.email,
          password: event.target.value,
          confirmPassword: form.confirmPassword, 
        });
        break;
      case "confirmPassword":
        setForm({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: event.target.value, 
        });
        break;
      default:
        console.log("Erro nos estados");
    };
  }

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setLoading(true);

      const isValid = registerSchema.safeParse(form);

      if (!isValid.success) {
        setError({
          error: true,
          message: "Erro ao validar dados:  " + isValid.error.format()
        });

        console.log("Suas credenciais não estão corretas");

        return;
      };

      const formDataSanitized = {
				name: sanitize(form.name),
				email: sanitize(form.email),
				password: sanitize(form.password),
        confirmPassword: sanitize(form.confirmPassword)
			};

      const params: IRequestParams<"POST"> = {
        method: "POST",
        body: JSON.stringify(formDataSanitized)
      }

      const response = await Api.post("/signup", params);
      console.log(await response);

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      

    } catch (err){
      console.log(err);
      setError({
        error: true,
        message: "Erro ao enviar requisição: " + err
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    handleChange,
    handleSubmit
  }
}