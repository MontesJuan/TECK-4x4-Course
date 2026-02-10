"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitExam } from "@/actions/exam"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface Question {
    id: string
    text: string
    options: {
        id: string
        text: string
    }[]
}

interface ExamFormProps {
    moduleId: string
    questions: Question[]
}

export const ExamForm = ({ moduleId, questions }: ExamFormProps) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [answers, setAnswers] = useState<Record<string, string>>({})

    const [result, setResult] = useState<{
        passed: boolean
        score: number
        correctCount: number
        totalQuestions: number
    } | null>(null)

    const handleOptionSelect = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }))
    }

    const handleSubmit = () => {
        // Validation: Check if all questions answered
        if (Object.keys(answers).length < questions.length) {
            toast.error("Por favor responde todas las preguntas antes de enviar.")
            return
        }

        startTransition(() => {
            submitExam({ moduleId, answers }).then(data => {
                if (data.error) {
                    toast.error(data.error)
                } else if (data.success) {
                    setResult({
                        passed: data.passed,
                        score: data.score,
                        correctCount: data.correctCount,
                        totalQuestions: data.totalQuestions
                    })
                    if (data.passed) {
                        toast.success("¡Examen aprobado!")
                    } else {
                        toast.error("Examen reprobado. Inténtalo de nuevo.")
                    }
                }
            })
        })
    }

    if (result) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {result.passed ? "¡Felicitaciones!" : "Inténtalo de nuevo"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 py-8">
                    {result.passed ? (
                        <CheckCircle className="w-24 h-24 text-green-500" />
                    ) : (
                        <XCircle className="w-24 h-24 text-red-500" />
                    )}

                    <div className="text-center space-y-2">
                        <p className="text-xl font-medium">
                            Tu puntaje: {result.score.toFixed(0)}%
                        </p>
                        <p className="text-muted-foreground">
                            Respondiste correctamente {result.correctCount} de {result.totalQuestions} preguntas.
                        </p>
                        <p className="text-sm font-semibold">
                            Requerido para aprobar: 80%
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => router.push(`/dashboard/module/${moduleId}`)}>
                        Volver al Módulo
                    </Button>
                    {result.passed ? (
                        <Button onClick={() => router.push("/dashboard")}>
                            Siguiente Módulo
                        </Button>
                    ) : (
                        <Button onClick={() => {
                            setResult(null)
                            setAnswers({})
                        }}>
                            Reintentar Examen
                        </Button>
                    )}
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold mb-6">Examen del Módulo</h1>

            {questions.map((q, index) => (
                <Card key={q.id}>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">
                            {index + 1}. {q.text}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={answers[q.id]}
                            onValueChange={(val) => handleOptionSelect(q.id, val)}
                        >
                            {q.options.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value={option.id} id={option.id} disabled={isPending} />
                                    <Label htmlFor={option.id} className="text-base font-normal cursor-pointer">
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-end pt-4">
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                        </>
                    ) : (
                        "Enviar Examen"
                    )}
                </Button>
            </div>
        </div>
    )
}
