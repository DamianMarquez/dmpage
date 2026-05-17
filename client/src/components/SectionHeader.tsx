interface Props {
    index: string;
    title: string;
  }
  
  export default function SectionHeader({ index, title }: Props) {
    return (
      <div className="section-header">
        <span className="section-tag">
          {index} / {title}
        </span>
  
        <div className="section-line"></div>
      </div>
    );
  }