import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@/components'

/** Whether a phase asks its students for a profile picture, and whether they can skip it. */
export type ProfilePictureRequirement = 'off' | 'optional' | 'required'

export interface ProfilePictureRequirementSettingProps {
  value: ProfilePictureRequirement
  onChange: (value: ProfilePictureRequirement) => void
  /** Leaves out "required", e.g. for phases where a picture must never be mandatory. */
  allowRequired?: boolean
  disabled?: boolean
  /** Phase-specific settings shown below the choice in the same card, e.g. a save button. */
  children?: ReactNode
}

const OPTIONS: { value: ProfilePictureRequirement; label: string; description: string }[] = [
  {
    value: 'off',
    label: 'Off',
    description: 'Students are not asked for a profile picture in this phase.',
  },
  {
    value: 'optional',
    label: 'Optional',
    description: 'Students without a picture are asked to add one and can dismiss the request.',
  },
  {
    value: 'required',
    label: 'Required',
    description: 'Students without a picture are asked to add one until they do.',
  },
]

/**
 * Lets lecturers choose whether this phase asks students for a profile picture. The phase stores
 * the value in its own configuration and passes it to `ProfilePictureUploadPrompt`.
 */
export function ProfilePictureRequirementSetting({
  value,
  onChange,
  allowRequired = true,
  disabled = false,
  children,
}: ProfilePictureRequirementSettingProps) {
  const options = allowRequired ? OPTIONS : OPTIONS.filter((option) => option.value !== 'required')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Profile picture</CardTitle>
        <CardDescription>
          Ask students to upload a profile picture, so they can be recognized in teams and reviews.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={(next) => onChange(next as ProfilePictureRequirement)}
          disabled={disabled}
          className='gap-3'
        >
          {options.map((option) => (
            <div key={option.value} className='flex items-start gap-3'>
              <RadioGroupItem
                value={option.value}
                id={`profile-picture-requirement-${option.value}`}
                className='mt-0.5'
              />
              <Label
                htmlFor={`profile-picture-requirement-${option.value}`}
                className='flex flex-col items-start gap-1 font-normal'
              >
                <span className='font-medium'>{option.label}</span>
                <span className='text-sm text-muted-foreground'>{option.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {children && <div className='mt-6 space-y-6'>{children}</div>}
      </CardContent>
    </Card>
  )
}
