import React from 'react'
import PropTypes from 'prop-types'

// Class sign-in for young students (architecture/ADR_CLASS_KID_LOGIN.md): the nine pictures a
// secret is made of and the avatars children find themselves by. Own SVG, not emoji: school
// Windows draws emoji differently or not at all. The order is part of the data — the server
// stores picture and avatar numbers, so new ones go only to the end.

const PICTURES = [
  {
    key: 'apple',
    draw: (
      <React.Fragment>
        <circle cx='50' cy='58' r='30' fill='#e53935' />
        <rect x='47' y='18' width='6' height='16' rx='3' fill='#6d4c41' />
        <ellipse cx='64' cy='24' rx='12' ry='6' fill='#43a047' transform='rotate(-25 64 24)' />
      </React.Fragment>
    ),
  },
  {
    key: 'sun',
    draw: (
      <React.Fragment>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <rect
            key={a}
            x='47'
            y='6'
            width='6'
            height='18'
            rx='3'
            fill='#fb8c00'
            transform={`rotate(${a} 50 50)`}
          />
        ))}
        <circle cx='50' cy='50' r='22' fill='#fdd835' />
      </React.Fragment>
    ),
  },
  {
    key: 'star',
    draw: (
      <polygon
        points='50,8 61,38 93,38 67,57 77,88 50,69 23,88 33,57 7,38 39,38'
        fill='#fbc02d'
        stroke='#f57f17'
        strokeWidth='3'
        strokeLinejoin='round'
      />
    ),
  },
  {
    key: 'rocket',
    draw: (
      <React.Fragment>
        <path d='M50 6 C68 22 70 50 62 72 H38 C30 50 32 22 50 6 Z' fill='#90a4ae' />
        <circle cx='50' cy='38' r='9' fill='#4fc3f7' stroke='#37474f' strokeWidth='3' />
        <path d='M38 58 L24 78 L38 74 Z M62 58 L76 78 L62 74 Z' fill='#e53935' />
        <path d='M42 72 L50 94 L58 72 Z' fill='#ff9800' />
      </React.Fragment>
    ),
  },
  {
    key: 'house',
    draw: (
      <React.Fragment>
        <rect x='22' y='44' width='56' height='44' fill='#ffcc80' />
        <polygon points='14,48 50,14 86,48' fill='#c62828' />
        <rect x='42' y='62' width='16' height='26' fill='#6d4c41' />
        <rect x='28' y='54' width='10' height='10' fill='#4fc3f7' />
        <rect x='62' y='54' width='10' height='10' fill='#4fc3f7' />
      </React.Fragment>
    ),
  },
  {
    key: 'ball',
    draw: (
      <React.Fragment>
        <circle cx='50' cy='50' r='36' fill='#1e88e5' />
        <path d='M14 50 H86' stroke='#fff' strokeWidth='6' />
        <path d='M50 14 C36 30 36 70 50 86' stroke='#fff' strokeWidth='6' fill='none' />
        <path d='M50 14 C64 30 64 70 50 86' stroke='#fff' strokeWidth='6' fill='none' />
      </React.Fragment>
    ),
  },
  {
    key: 'tree',
    draw: (
      <React.Fragment>
        <rect x='44' y='60' width='12' height='30' fill='#795548' />
        <circle cx='50' cy='40' r='26' fill='#43a047' />
        <circle cx='32' cy='52' r='16' fill='#388e3c' />
        <circle cx='68' cy='52' r='16' fill='#388e3c' />
      </React.Fragment>
    ),
  },
  {
    key: 'car',
    draw: (
      <React.Fragment>
        <path d='M12 66 V52 L26 50 L36 32 H66 L78 50 L90 54 V66 Z' fill='#8e24aa' />
        <path d='M40 36 H52 V50 H32 Z M56 36 H64 L72 50 H56 Z' fill='#b3e5fc' />
        <circle cx='30' cy='68' r='10' fill='#263238' />
        <circle cx='72' cy='68' r='10' fill='#263238' />
      </React.Fragment>
    ),
  },
  {
    key: 'umbrella',
    draw: (
      <React.Fragment>
        <path d='M10 50 C10 20 90 20 90 50 Z' fill='#00acc1' />
        <path
          d='M50 50 V80 C50 90 36 90 36 80'
          stroke='#455a64'
          strokeWidth='6'
          fill='none'
          strokeLinecap='round'
        />
        <path
          d='M30 50 C30 36 50 28 50 28 C50 28 70 36 70 50'
          stroke='#00838f'
          strokeWidth='3'
          fill='none'
        />
      </React.Fragment>
    ),
  },
]

export const KID_PICTURE_COUNT = PICTURES.length

export const kidPictureKey = index => PICTURES[index]?.key || 'unknown'

export const KidPicture = ({ index, size = 64 }) => {
  const picture = PICTURES[index]
  return (
    <svg viewBox='0 0 100 100' width={size} height={size} aria-hidden='true' focusable='false'>
      {picture ? picture.draw : <circle cx='50' cy='50' r='30' fill='#bdbdbd' />}
    </svg>
  )
}

KidPicture.propTypes = { index: PropTypes.number.isRequired, size: PropTypes.number }

// Avatars: ten animals in three colours, number = animal * 3 + colour.
const AVATAR_COLORS = ['#ffe082', '#b3e5fc', '#c8e6c9']

const eyes = (
  <React.Fragment>
    <circle cx='40' cy='52' r='5' fill='#212121' />
    <circle cx='60' cy='52' r='5' fill='#212121' />
  </React.Fragment>
)

const ANIMALS = [
  {
    key: 'cat',
    draw: c => (
      <React.Fragment>
        <polygon points='22,40 30,12 46,32' fill={c} stroke='#5d4037' strokeWidth='3' />
        <polygon points='78,40 70,12 54,32' fill={c} stroke='#5d4037' strokeWidth='3' />
        <circle cx='50' cy='56' r='30' fill={c} stroke='#5d4037' strokeWidth='3' />
        {eyes}
        <path d='M44 64 L50 68 L56 64' stroke='#5d4037' strokeWidth='3' fill='none' />
        <path d='M20 62 H36 M64 62 H80' stroke='#5d4037' strokeWidth='2' />
      </React.Fragment>
    ),
  },
  {
    key: 'bear',
    draw: c => (
      <React.Fragment>
        <circle cx='26' cy='30' r='12' fill={c} stroke='#5d4037' strokeWidth='3' />
        <circle cx='74' cy='30' r='12' fill={c} stroke='#5d4037' strokeWidth='3' />
        <circle cx='50' cy='56' r='32' fill={c} stroke='#5d4037' strokeWidth='3' />
        {eyes}
        <ellipse cx='50' cy='68' rx='12' ry='9' fill='#fff' stroke='#5d4037' strokeWidth='2' />
        <circle cx='50' cy='65' r='4' fill='#212121' />
      </React.Fragment>
    ),
  },
  {
    key: 'bunny',
    draw: c => (
      <React.Fragment>
        <ellipse cx='36' cy='22' rx='8' ry='20' fill={c} stroke='#5d4037' strokeWidth='3' />
        <ellipse cx='64' cy='22' rx='8' ry='20' fill={c} stroke='#5d4037' strokeWidth='3' />
        <circle cx='50' cy='60' r='28' fill={c} stroke='#5d4037' strokeWidth='3' />
        {eyes}
        <circle cx='50' cy='64' r='4' fill='#f06292' />
        <rect x='45' y='70' width='10' height='8' fill='#fff' stroke='#5d4037' strokeWidth='2' />
      </React.Fragment>
    ),
  },
  {
    key: 'mouse',
    draw: c => (
      <React.Fragment>
        <circle cx='22' cy='34' r='17' fill={c} stroke='#5d4037' strokeWidth='3' />
        <circle cx='78' cy='34' r='17' fill={c} stroke='#5d4037' strokeWidth='3' />
        <ellipse cx='50' cy='60' rx='26' ry='28' fill={c} stroke='#5d4037' strokeWidth='3' />
        {eyes}
        <circle cx='50' cy='70' r='5' fill='#f06292' />
      </React.Fragment>
    ),
  },
  {
    key: 'fox',
    draw: c => (
      <React.Fragment>
        <polygon points='18,20 40,34 26,50' fill='#ef6c00' />
        <polygon points='82,20 60,34 74,50' fill='#ef6c00' />
        <path
          d='M18 40 L50 88 L82 40 C70 28 30 28 18 40 Z'
          fill='#ef6c00'
          stroke={c}
          strokeWidth='6'
        />
        {eyes}
        <circle cx='50' cy='78' r='5' fill='#212121' />
      </React.Fragment>
    ),
  },
  {
    key: 'pig',
    draw: c => (
      <React.Fragment>
        <polygon points='24,22 40,32 26,42' fill='#f48fb1' />
        <polygon points='76,22 60,32 74,42' fill='#f48fb1' />
        <circle cx='50' cy='56' r='32' fill='#f8bbd0' stroke={c} strokeWidth='6' />
        <circle cx='38' cy='46' r='5' fill='#212121' />
        <circle cx='62' cy='46' r='5' fill='#212121' />
        <ellipse cx='50' cy='66' rx='14' ry='10' fill='#f48fb1' />
        <circle cx='45' cy='66' r='3' fill='#880e4f' />
        <circle cx='55' cy='66' r='3' fill='#880e4f' />
      </React.Fragment>
    ),
  },
  {
    key: 'frog',
    draw: c => (
      <React.Fragment>
        <circle cx='32' cy='30' r='14' fill='#66bb6a' stroke={c} strokeWidth='5' />
        <circle cx='68' cy='30' r='14' fill='#66bb6a' stroke={c} strokeWidth='5' />
        <ellipse cx='50' cy='60' rx='38' ry='28' fill='#66bb6a' />
        <circle cx='32' cy='30' r='6' fill='#212121' />
        <circle cx='68' cy='30' r='6' fill='#212121' />
        <path d='M30 66 C40 76 60 76 70 66' stroke='#1b5e20' strokeWidth='4' fill='none' />
      </React.Fragment>
    ),
  },
  {
    key: 'owl',
    draw: c => (
      <React.Fragment>
        <polygon points='22,24 36,36 22,40' fill='#8d6e63' />
        <polygon points='78,24 64,36 78,40' fill='#8d6e63' />
        <ellipse cx='50' cy='58' rx='32' ry='34' fill='#8d6e63' />
        <circle cx='36' cy='48' r='13' fill={c} />
        <circle cx='64' cy='48' r='13' fill={c} />
        <circle cx='36' cy='48' r='6' fill='#212121' />
        <circle cx='64' cy='48' r='6' fill='#212121' />
        <polygon points='44,62 56,62 50,74' fill='#ffb300' />
      </React.Fragment>
    ),
  },
  {
    key: 'panda',
    draw: c => (
      <React.Fragment>
        <circle cx='24' cy='28' r='12' fill='#212121' />
        <circle cx='76' cy='28' r='12' fill='#212121' />
        <circle cx='50' cy='56' r='32' fill='#fafafa' stroke={c} strokeWidth='6' />
        <ellipse cx='38' cy='52' rx='9' ry='11' fill='#212121' />
        <ellipse cx='62' cy='52' rx='9' ry='11' fill='#212121' />
        <circle cx='38' cy='52' r='3' fill='#fff' />
        <circle cx='62' cy='52' r='3' fill='#fff' />
        <ellipse cx='50' cy='70' rx='6' ry='4' fill='#212121' />
      </React.Fragment>
    ),
  },
  {
    key: 'dog',
    draw: c => (
      <React.Fragment>
        <ellipse cx='22' cy='46' rx='10' ry='22' fill='#6d4c41' />
        <ellipse cx='78' cy='46' rx='10' ry='22' fill='#6d4c41' />
        <circle cx='50' cy='54' r='30' fill={c} stroke='#5d4037' strokeWidth='3' />
        {eyes}
        <ellipse cx='50' cy='66' rx='7' ry='5' fill='#212121' />
        <path d='M50 71 V76' stroke='#212121' strokeWidth='3' />
      </React.Fragment>
    ),
  },
]

export const KID_AVATAR_COUNT = ANIMALS.length * AVATAR_COLORS.length

export const kidAvatarKey = index =>
  ANIMALS[Math.floor(index / AVATAR_COLORS.length)]?.key || 'unknown'

export const KidAvatar = ({ index, size = 64 }) => {
  const animal = ANIMALS[Math.floor(index / AVATAR_COLORS.length)] || ANIMALS[0]
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length] || AVATAR_COLORS[0]
  return (
    <svg viewBox='0 0 100 100' width={size} height={size} aria-hidden='true' focusable='false'>
      <circle cx='50' cy='50' r='50' fill={color} opacity='0.35' />
      {animal.draw(color)}
    </svg>
  )
}

KidAvatar.propTypes = { index: PropTypes.number.isRequired, size: PropTypes.number }
