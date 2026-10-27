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
  disabled?: boolean
  /** Replaces the default introduction, e.g. to address applicants instead of students. */
  description?: ReactNode
  /** Replaces the default description of single options, keyed by the option. */
  optionDescriptions?: Partial<Record<ProfilePictureRequirement, string>>
  /** Phase-specific settings shown below the choice in the same card, e.g. a save button. */
  children?: ReactNode
}

const DEFAULT_DESCRIPTION =
  'Ask students for a profile picture, so the course team can recognize them.'

const OPTIONS: { value: ProfilePictureRequirement; label: string; description: string }[] = [
  {
    value: 'off',
    label: 'Off',
    description: 'Students are not asked for a picture.',
  },
  {
    value: 'optional',
    label: 'Optional',
    description: 'Students are asked for a picture but can dismiss the request.',
  },
  {
    value: 'required',
    label: 'Required',
    description: 'Students are asked for a picture and cannot dismiss the request.',
  },
]

/**
 * Lets lecturers choose whether this phase asks students for a profile picture. The phase stores
 * the value in its own configuration and passes it to `ProfilePictureUploadPrompt`.
 */
export function ProfilePictureRequirementSetting({
  value,
  onChange,
  disabled = false,
  description = DEFAULT_DESCRIPTION,
  optionDescriptions,
  children,
}: ProfilePictureRequirementSettingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Profile picture</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={(next) => onChange(next as ProfilePictureRequirement)}
          disabled={disabled}
          className='gap-3'
        >
          {OPTIONS.map((option) => (
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
                <span className='text-sm text-muted-foreground'>
                  {optionDescriptions?.[option.value] ?? option.description}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {children && <div className='mt-6 space-y-6'>{children}</div>}
      </CardContent>
    </Card>
  )
}
