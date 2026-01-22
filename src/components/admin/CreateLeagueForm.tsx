'use client'

import { useState, useTransition } from 'react'
import { createLeague } from '@/app/actions/leagues'

export default function CreateLeagueForm() {
  const [name, setName] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const error = await createLeague(name)
      if (error) {
        alert(error)
      } else {
        setName('')
      }
    })
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Create a New League</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="League Name"
          className="flex-grow px-3 py-2 text-sm border rounded-md"
          required
        />
        <button type="submit" disabled={isPending} className="px-4 py-2 font-bold text-white bg-primary rounded-md disabled:opacity-50">
          {isPending ? 'Creating...' : 'Create League'}
        </button>
      </form>
    </div>
  )
}
