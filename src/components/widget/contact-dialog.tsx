"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function ContactDialog() {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const form = useForm<{ name: string; contact: string }>({
        defaultValues: { name: "", contact: "" },
        mode: "onSubmit",
    });

    const onSubmit = async (values: { name: string; contact: string }) => {
        setSubmitError(null);
        setSubmitSuccess(false);
        setSubmitting(true);
        try {
            const res = await fetch("/api/notion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name.trim(),
                    contact: values.contact.trim(),
                }),
            });
            if (!res.ok) {
                const data = (await res
                    .json()
                    .catch(() => ({ error: "Unknown error" }))) as {
                    error?: string;
                };
                throw new Error(data.error || `Request failed (${res.status})`);
            }
            setSubmitSuccess(true);
            form.reset({ name: "", contact: "" });
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : "Failed to submit",
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="default">
                    Register / Log in
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Interested in TimeSpot?</DialogTitle>
                    <DialogDescription>
                        Time Spot is an experimental project. If you're
                        interested, please share your contact details and we'll
                        reach out.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4 py-2"
                    >
                        <div className="flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: "Name is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact"
                                rules={{ required: "Contact is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your contact"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Contact can be email, telegram,
                                            phone, etc.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {submitError ? (
                                <p className="text-xs text-destructive">
                                    {submitError}
                                </p>
                            ) : null}
                            {submitSuccess ? (
                                <p className="text-sm text-emerald-600">
                                    Thanks! We received your info.
                                </p>
                            ) : null}
                        </div>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={submitting}
                        >
                            {submitting && <Spinner className="size-4" />}
                            {submitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>
                <DialogFooter className="sm:justify-start">
                    <p className="text-xs text-muted-foreground">
                        By continuing, you agree to our Terms and Privacy
                        Policy.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
