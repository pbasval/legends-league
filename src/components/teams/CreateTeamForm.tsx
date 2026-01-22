'use client'

import { useState, useTransition } from 'react'
import { createTeam } from '@/app/actions/teams'

export default function CreateTeamForm({ leagueId }: { leagueId: string }) {
  const [name, setName] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const error = await createTeam(name, leagueId)
      if (error) {
        alert(error)
      } else {
        setName('')
      }
    })
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Create a New Team</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team Name"
          className="flex-grow px-3 py-2 text-sm border rounded-md"
          required
        />
        <button type="submit" disabled={isPending} className="px-4 py-2 font-bold text-white bg-primary rounded-md disabled:opacity-50">
          {isPending ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </div>
  )
}
