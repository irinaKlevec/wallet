import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M14.402 3.556H9.598c-.16 0-.289.131-.292.295-.097 4.61-2.458 8.984-6.52 12.082a.304.304 0 0 0-.064.416l2.81 3.97a.29.29 0 0 0 .414.067c2.54-1.925 4.583-4.246 6.054-6.82 1.471 2.574 3.514 4.895 6.055 6.82a.29.29 0 0 0 .413-.066l2.81-3.97a.304.304 0 0 0-.064-.417c-4.062-3.098-6.422-7.473-6.52-12.082a.297.297 0 0 0-.292-.295ZM20.724 6.492l-.5-1.568a1.017 1.017 0 0 0-.666-.664l-1.554-.484c-.215-.067-.217-.374-.003-.444l1.546-.507a1.02 1.02 0 0 0 .656-.675L20.68.575a.229.229 0 0 1 .438-.003l.5 1.567c.103.318.35.566.666.665l1.554.484c.214.067.217.374.003.444l-1.546.507a1.018 1.018 0 0 0-.656.675l-.477 1.575a.229.229 0 0 1-.438.003Z"
      fill="#fff"
    />
  </svg>
)
export default SvgComponent