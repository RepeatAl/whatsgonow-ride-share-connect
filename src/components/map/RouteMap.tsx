
import { useRef, useEffect } from "react";

interface RouteMapProps {
  startPoint: string;
  endPoint: string;
  className?: string;
}

const RouteMap = ({ startPoint, endPoint, className = "" }: RouteMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // In a real app, we would use a proper mapping API here
  // This is just a simple visualization for the demo
  useEffect(() => {
    // Placeholder map rendering logic
    if (svgRef.current) {
      const svg = svgRef.current;
      
      // Clear previous content
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
      
      // Create random route points
      const points = [];
      const numPoints = 6;
      
      for (let i = 0; i < numPoints; i++) {
        const x = 50 + (i * (800 - 100) / (numPoints - 1));
        const y = 200 + Math.sin(i * Math.PI / (numPoints - 1)) * 80 + (Math.random() * 40 - 20);
        points.push([x, y]);
      }
      
      // Create path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      let pathData = `M ${points[0][0]},${points[0][1]}`;
      
      for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];
        pathData += ` L ${x},${y}`;
      }
      
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#9b87f5');
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.classList.add('route-animation');
      
      svg.appendChild(path);
      
      // Start point
      const startCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      startCircle.setAttribute('cx', points[0][0].toString());
      startCircle.setAttribute('cy', points[0][1].toString());
      startCircle.setAttribute('r', '8');
      startCircle.setAttribute('fill', '#9b87f5');
      
      svg.appendChild(startCircle);
      
      // End point
      const endCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      endCircle.setAttribute('cx', points[points.length - 1][0].toString());
      endCircle.setAttribute('cy', points[points.length - 1][1].toString());
      endCircle.setAttribute('r', '8');
      endCircle.setAttribute('fill', '#0EA5E9');
      
      svg.appendChild(endCircle);
      
      // Start label
      const startText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      startText.setAttribute('x', (points[0][0] - 10).toString());
      startText.setAttribute('y', (points[0][1] - 15).toString());
      startText.setAttribute('fill', '#1A1F2C');
      startText.setAttribute('font-size', '14');
      startText.setAttribute('font-weight', 'bold');
      startText.textContent = startPoint;
      
      svg.appendChild(startText);
      
      // End label
      const endText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      endText.setAttribute('x', (points[points.length - 1][0] - 10).toString());
      endText.setAttribute('y', (points[points.length - 1][1] - 15).toString());
      endText.setAttribute('fill', '#1A1F2C');
      endText.setAttribute('font-size', '14');
      endText.setAttribute('font-weight', 'bold');
      endText.textContent = endPoint;
      
      svg.appendChild(endText);
    }
  }, [startPoint, endPoint]);

  return (
    <div className={`map-container ${className}`}>
      <div className="bg-gray-100 rounded-lg overflow-hidden h-full w-full">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
        ></svg>
      </div>
    </div>
  );
};

export default RouteMap;
