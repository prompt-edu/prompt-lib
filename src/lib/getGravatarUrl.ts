/**
 * @deprecated PROMPT no longer sends anyone's email hash to Gravatar. This returns an empty URL,
 * which makes an Avatar fall back to its initials, so existing callers keep compiling and working.
 * Show PROMPT profile pictures with the ProfilePicture component instead.
 */
export const getGravatarUrl = (_email: string, _size?: number): string => ''
