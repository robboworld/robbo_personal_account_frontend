/**
 * File types in the picker, finer than FILE_KIND_GROUPS (which also groups a file assignment's
 * accepted types): documents split by what they are. Order is the "by type" sort order.
 */
export const PICKER_GROUPS = Object.freeze([
  { key: 'images', kinds: ['png', 'jpeg', 'gif'], label: 'class_files.group_images' },
  { key: 'scratch', kinds: ['sb3', 'sb2', 'sb', 'sjr'], label: 'class_files.group_scratch' },
  { key: 'python', kinds: ['py'], label: 'class_files.group_python' },
  { key: 'arduino', kinds: ['ino'], label: 'class_files.group_arduino' },
  { key: 'appinventor', kinds: ['aia', 'apk'], label: 'class_files.group_appinventor' },
  { key: 'model3d', kinds: ['stl'], label: 'class_files.group_model3d' },
  { key: 'freecad', kinds: ['fcstd'], label: 'class_files.group_freecad' },
  { key: 'sketchup', kinds: ['skp'], label: 'class_files.group_sketchup' },
  { key: 'blender', kinds: ['blend'], label: 'class_files.group_blender' },
  { key: 'pdf', kinds: ['pdf'], label: 'file_picker.group_pdf' },
  { key: 'text', kinds: ['docx', 'odt'], label: 'file_picker.group_text' },
  { key: 'sheets', kinds: ['xlsx'], label: 'file_picker.group_sheets' },
  { key: 'slides', kinds: ['pptx'], label: 'file_picker.group_slides' },
  { key: 'plaintext', kinds: ['txt'], label: 'file_picker.group_plaintext' },
  { key: 'audio', kinds: ['mp3', 'wav', 'ogg'], label: 'class_files.group_audio' },
  { key: 'archive', kinds: ['zip'], label: 'class_files.group_archive' },
])

const INDEX = Object.fromEntries(PICKER_GROUPS.map((g, i) => [g.key, i]))

export const pickerGroupOf = kind => PICKER_GROUPS.find(g => g.kinds.includes(kind))?.key || 'other'

/** Position of a file's group in PICKER_GROUPS; unknown types go last. */
export const pickerGroupIndex = kind => INDEX[pickerGroupOf(kind)] ?? PICKER_GROUPS.length
