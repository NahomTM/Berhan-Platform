import * as React from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import SvgIcon from "@mui/joy/SvgIcon";

export default function ActionAreaCard({ title, description, icon }) {
  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <div className="p-4">
        <div className="bg-orange-500 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <div>
          <Typography className="text-black font-bold text-lg mb-2" level="body-md">{title}</Typography>
          <Typography className="text-gray-700 text-md font-semibold" level="body-md">{description}</Typography>
        </div>
      </div>
      <style>{`
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
        .rounded-full {
          border-radius: 50%;
        }
        .bg-orange-500 {
          background-color: #f97316;
        }
        .text-lg {
          font-size: 1.4rem;
        }
        .text-md {
          font-size: 1.1rem;
        }
      `}</style>
    </Card>
  );
}
