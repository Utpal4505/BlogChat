const EmptyState = ({ icon, title, subtitle }) => {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="w-24 h-24 rounded-[22px] bg-gradient-to-br from-accent/10 to-primary/10 dark:from-daccent/10 dark:to-dPrimary/10 flex items-center justify-center mb-6 shadow-lg">
        {Icon ? <Icon className="w-11 h-11 text-accent dark:text-daccent" /> : null}
      </div>
      <h3 className="text-[24px] font-bold text-text dark:text-dText mb-3">{title}</h3>
      <p className="text-[15px] text-muted-text dark:text-dMuted-text max-w-[320px] leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default EmptyState;
