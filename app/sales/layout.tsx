export const metadata = {
    title: "Sales",
};

const ProductLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="py-10 px-10">{children}</div>
  )
}

export default ProductLayout