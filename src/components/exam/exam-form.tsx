"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitExam, syncExamToSheets } from "@/actions/exam"
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
    const [isLoading, setIsLoading] = useState(false)
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

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            toast.error("Por favor responde todas las preguntas antes de enviar.")
            return
        }

        setIsLoading(true)

        try {
            const data = await submitExam({ moduleId, answers })

            if (!data) {
                toast.error("Error inesperado. Por favor intenta nuevamente.")
                return
            }

            if ("error" in data && data.error) {
                toast.error(data.error)
                return
            }

            if ("success" in data && data.success) {
                setResult({
                    passed: data.passed ?? false,
                    score: data.score ?? 0,
                    correctCount: data.correctCount ?? 0,
                    totalQuestions: data.totalQuestions ?? 0
                })

                // Disparar sincronización con Sheets en segundo plano sin bloquear UI
                syncExamToSheets().catch(console.error)
            }
        } catch (err) {
            console.error("Error submitting exam:", err)
            toast.error("Error al enviar el examen. Por favor intenta nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

    // ── Result card (shown after submission, stays until user clicks button) ──
    if (result) {
        return (
            <Card className="w-full max-w-2xl mx-auto mt-8 bg-zinc-900 border-zinc-800 shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                        {result.passed ? "¡Examen Completado!" : "Examen Completado"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 py-8">
                    {result.passed ? (
                        <CheckCircle className="w-24 h-24 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                    ) : (
                        <CheckCircle className="w-24 h-24 text-zinc-500" />
                    )}

                    <div className="text-center space-y-3">
                        <p className="text-5xl font-black text-white drop-shadow-lg">
                            {result.score.toFixed(0)}%
                        </p>
                        <p className="text-zinc-400 text-lg">
                            Respondiste correctamente{" "}
                            <span className="font-bold text-white">{result.correctCount}</span>
                            {" "}de{" "}
                            <span className="font-bold text-white">{result.totalQuestions}</span>
                        </p>
                        <div className="bg-zinc-950 px-6 py-3 rounded-xl border border-zinc-800 mt-4 inline-block">
                            <p className="text-sm font-medium text-zinc-300">
                                Tu resultado ha sido guardado.
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                Recuerda que necesitas un promedio final &ge; 80% para reclamar tu certificado.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <Button
                        size="lg"
                        className="bg-white text-black hover:bg-zinc-200 font-bold px-12 py-6 rounded-full text-lg shadow-xl hover:shadow-white/20 transition-all hover:scale-105"
                        onClick={() => router.push("/dashboard")}
                    >
                        Siguiente →
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    // ── Exam form ──────────────────────────────────────────────────────────────
    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
            <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-white">Examen del Módulo</h1>

            {questions.map((q, index) => (
                <Card key={q.id} className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-xl">
                    <CardHeader className="bg-zinc-950/50 border-b border-zinc-800">
                        <CardTitle className="text-xl font-bold text-zinc-100 leading-relaxed">
                            {index + 1}. {q.text}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <RadioGroup
                            value={answers[q.id]}
                            onValueChange={(val) => handleOptionSelect(q.id, val)}
                            className="space-y-3"
                        >
                            {q.options.map((option) => (
                                <div key={option.id} className="flex items-center space-x-3 py-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 px-4 rounded-lg cursor-pointer transition-colors" onClick={() => handleOptionSelect(q.id, option.id)}>
                                    <RadioGroupItem value={option.id} id={option.id} disabled={isLoading} className="border-white text-white fill-white focus:text-white" />
                                    <Label htmlFor={option.id} className="text-lg font-medium text-white cursor-pointer w-full leading-snug">
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-end pt-4 pb-8">
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
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
