import {
  CrownOutlined,
  HeartOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  SmileOutlined,
} from '@ant-design/icons'

import { PARENT, STUDENT, SUPER_ADMIN, TEACHER, UNIT_ADMIN } from './userRole'

// Role icon and badge accent (AccountShell roleBadgeAccent). A free listener has none.
export const ROLE_ICONS = {
  [STUDENT]: { accent: 'student', Icon: SmileOutlined },
  [TEACHER]: { accent: 'teacher', Icon: ReadOutlined },
  [PARENT]: { accent: 'parent', Icon: HeartOutlined },
  [UNIT_ADMIN]: { accent: 'unitAdmin', Icon: SafetyCertificateOutlined },
  [SUPER_ADMIN]: { accent: 'superAdmin', Icon: CrownOutlined },
}
