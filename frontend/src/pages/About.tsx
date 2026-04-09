export function About() {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-primary">
          About Me
        </h1>
      </div>
      
      <div className="bg-background border-3 border-primary rounded-sm p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] min-h-[400px]">
        {/* The content area is left empty as requested by the PRD */}
        <p className="text-gray-500 italic font-mono text-center mt-20">
          Content to be added...
        </p>
      </div>
    </div>
  );
}