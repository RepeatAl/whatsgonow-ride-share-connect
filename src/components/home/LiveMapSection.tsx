
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import StableHereMapWithData from "@/components/map/StableHereMapWithData";

const LiveMapSection = () => {
  const { t } = useTranslation(['landing']);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("landing:map.title", "Live Transport Map")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t(
              "landing:map.description",
              "Diese Karte zeigt öffentlich verfügbare Transportbewegungen. Aus Datenschutzgründen sind keine personenbezogenen Daten sichtbar."
            )}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="h-[300px] md:h-[500px] w-full">
                <StableHereMapWithData
                  height="100%"
                  width="100%"
                  className="rounded-lg"
                  center={{ lat: 51.1657, lng: 10.4515 }}
                  zoom={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveMapSection;
