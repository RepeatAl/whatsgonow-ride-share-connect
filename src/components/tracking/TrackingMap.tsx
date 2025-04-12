
import { useRef, useEffect } from "react";

interface TrackingMapProps {
  driverLocation: {
    lat: number;
    lng: number;
  };
  pickupLocation: string;
  deliveryLocation: string;
}

const TrackingMap = ({ driverLocation, pickupLocation, deliveryLocation }: TrackingMapProps) => {
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
      
      // Driver position (use driverLocation)
      const proportion = (driverLocation.lng - 11.58) / 0.01; // Simplified calculation for demo
      const pointIndex = Math.min(Math.floor(proportion * numPoints), numPoints - 1);
      const driverX = points[Math.max(0, pointIndex)][0] + (Math.random() * 20 - 10);
      const driverY = points[Math.max(0, pointIndex)][1] + (Math.random() * 20 - 10);
      
      const driverCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      driverCircle.setAttribute('cx', driverX.toString());
      driverCircle.setAttribute('cy', driverY.toString());
      driverCircle.setAttribute('r', '10');
      driverCircle.setAttribute('fill', '#ff5722');
      driverCircle.setAttribute('stroke', 'white');
      driverCircle.setAttribute('stroke-width', '2');
      
      svg.appendChild(driverCircle);
      
      // Pulse animation for driver
      const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseCircle.setAttribute('cx', driverX.toString());
      pulseCircle.setAttribute('cy', driverY.toString());
      pulseCircle.setAttribute('r', '10');
      pulseCircle.setAttribute('fill', '#ff5722');
      pulseCircle.setAttribute('opacity', '0.6');
      
      // Add animation
      const animateRadius = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateRadius.setAttribute('attributeName', 'r');
      animateRadius.setAttribute('from', '10');
      animateRadius.setAttribute('to', '20');
      animateRadius.setAttribute('dur', '1.5s');
      animateRadius.setAttribute('repeatCount', 'indefinite');
      
      const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateOpacity.setAttribute('attributeName', 'opacity');
      animateOpacity.setAttribute('from', '0.6');
      animateOpacity.setAttribute('to', '0');
      animateOpacity.setAttribute('dur', '1.5s');
      animateOpacity.setAttribute('repeatCount', 'indefinite');
      
      pulseCircle.appendChild(animateRadius);
      pulseCircle.appendChild(animateOpacity);
      
      svg.appendChild(pulseCircle);
      
      // Start label
      const startText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      startText.setAttribute('x', (points[0][0] - 10).toString());
      startText.setAttribute('y', (points[0][1] - 15).toString());
      startText.setAttribute('fill', '#1A1F2C');
      startText.setAttribute('font-size', '14');
      startText.setAttribute('font-weight', 'bold');
      startText.textContent = pickupLocation;
      
      svg.appendChild(startText);
      
      // End label
      const endText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      endText.setAttribute('x', (points[points.length - 1][0] - 10).toString());
      endText.setAttribute('y', (points[points.length - 1][1] - 15).toString());
      endText.setAttribute('fill', '#1A1F2C');
      endText.setAttribute('font-size', '14');
      endText.setAttribute('font-weight', 'bold');
      endText.textContent = deliveryLocation;
      
      svg.appendChild(endText);
      
      // Driver label
      const driverText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      driverText.setAttribute('x', (driverX).toString());
      driverText.setAttribute('y', (driverY - 15).toString());
      driverText.setAttribute('fill', '#ff5722');
      driverText.setAttribute('font-size', '12');
      driverText.setAttribute('font-weight', 'bold');
      driverText.setAttribute('text-anchor', 'middle');
      driverText.textContent = "Fahrer";
      
      svg.appendChild(driverText);
    }
  }, [driverLocation, pickupLocation, deliveryLocation]);

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden h-full w-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      ></svg>
    </div>
  );
};

export default TrackingMap;
