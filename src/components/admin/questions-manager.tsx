"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createQuestion, deleteQuestion } from "@/actions/question"
import { toast } from "sonner"
import { Trash, Plus, Check } from "lucide-react"

interface Question {
    id: string
    text: string
    options: {
        id: string
        text: string
        isCorrect: boolean
    }[]
}

export const QuestionsManager = ({ moduleId, questions }: { moduleId: string, questions: Question[] }) => {
    const [isPending, startTransition] = useTransition()

    // New Question State
    const [text, setText] = useState("")
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
    ])

    const handleOptionChange = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
        const newOptions = [...options]
        if (field === "isCorrect") {
            // Ensure only one is correct (or allow multiple? Prompt implies single choice "multiple choice")
            // "con la posibilidad de contestar solo una vez cada pregunta"
            // Usually multiple choice has one correct answer.
            // I'll make it radio-like behavior for isCorrect checkbox?
            // Or allow multiple correct answers logic (but simple is one).
            // Let's enforce single correct answer for simplicity in checking logic.
            if (value === true) {
                newOptions.forEach(o => o.isCorrect = false)
            }
            newOptions[index].isCorrect = value as boolean
        } else {
            newOptions[index].text = value as string
        }
        setOptions(newOptions)
    }

    const handleAddOption = () => {
        setOptions([...options, { text: "", isCorrect: false }])
    }

    const handleRemoveOption = (index: number) => {
        if (options.length <= 2) return
        setOptions(options.filter((_, i) => i !== index))
    }

    const handleCreate = () => {
        if (!text || options.some(o => !o.text) || !options.some(o => o.isCorrect)) {
            toast.error("Complete todos los campos y seleccione una opción correcta.")
            return
        }

        startTransition(() => {
            createQuestion(moduleId, { text, options }).then(data => {
                if (data.error) toast.error(data.error)
                if (data.success) {
                    toast.success(data.success)
                    setText("")
                    setOptions([
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false }
                    ])
                }
            })
        })
    }

    const handleDelete = (id: string) => {
        if (!confirm("Eliminar pregunta?")) return
        startTransition(() => {
            deleteQuestion(id).then(data => {
                if (data.success) toast.success("Pregunta eliminada")
            })
        })
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white text-black p-4 rounded shadow border">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">Pregunta {idx + 1}: {q.text}</h3>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(q.id)} disabled={isPending}>
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                        <ul className="space-y-1 pl-4">
                            {q.options.map(o => (
                                <li key={o.id} className={`text-sm flex items-center gap-2 ${o.isCorrect ? "text-green-600 font-bold" : ""}`}>
                                    {o.isCorrect && <Check className="h-3 w-3" />}
                                    {o.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                {questions.length === 0 && <p className="text-muted-foreground">No hay preguntas configuradas.</p>}
            </div>

            <div className="bg-white text-black p-6 rounded shadow border space-y-4">
                <h3 className="text-lg font-semibold">Agregar Nueva Pregunta</h3>

                <div>
                    <Label>Enunciado</Label>
                    <Input value={text} onChange={e => setText(e.target.value)} disabled={isPending} />
                </div>

                <div className="space-y-2">
                    <Label>Opciones</Label>
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <Checkbox
                                checked={opt.isCorrect}
                                onCheckedChange={(checked) => handleOptionChange(idx, "isCorrect", !!checked)}
                                disabled={isPending}
                            />
                            <Input
                                value={opt.text}
                                onChange={e => handleOptionChange(idx, "text", e.target.value)}
                                placeholder={`Opción ${idx + 1}`}
                                disabled={isPending}
                            />
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveOption(idx)} disabled={options.length <= 2}>
                                <Trash className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddOption} disabled={isPending}>
                        <Plus className="h-3 w-3 mr-1" /> Agregar Opción
                    </Button>
                </div>

                <Button onClick={handleCreate} disabled={isPending} className="w-full">
                    Guardar Pregunta
                </Button>
            </div>
        </div>
    )
}
