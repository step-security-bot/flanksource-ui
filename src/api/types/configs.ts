import { Agent, CreatedAt, Avatar, Timestamped } from "../traits";

export interface ConfigChange extends CreatedAt, Avatar {
  id: string;
  config_id: string;
  external_change_id: string;
  change_type: string;
  severity: string;
  source: string;
  summary: string;
  patches?: string;
  diff?: string;
  details: string;
  external_created_by: string;
  config?: ConfigItem;
  config_class?: string;
  type?: string;
  name?: string;
}

export interface Change {
  change_type: string;
  total: number;
  severity?: string;
}

export interface Costs {
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
}

export function isCostsEmpty(costs: Costs) {
  return (
    !costs.cost_per_minute &&
    !costs.cost_total_1d &&
    !costs.cost_total_7d &&
    !costs.cost_total_30d
  );
}

export interface ConfigItem extends Timestamped, Avatar, Agent, Costs {
  id: string;
  name: string;
  external_id?: string;
  config_class?: string;
  type?: string;
  changes?: Change[];
  analysis?: Analysis[];
  tags?: Record<string, any>;
  allTags?: Record<string, any>;
  config?: Record<string, any>;
  agent?: {
    id: string;
    name: string;
  };
  config_scrapers?: {
    id: string;
    name: string;
  };
}

export interface ConfigTypeRelationships extends Timestamped {
  config_id: string;
  related_id: string;
  property: string;
  selector_id: string;
  configs: ConfigItem;
  related: ConfigItem;
}

export interface Analysis {
  category: string;
  severity: string;
  description: string;
  analysis_type: string;
  analyzer: string;
}

export interface ConfigAnalysis extends Analysis, CreatedAt, Avatar {
  id: string;
  config_id: string;
  summary: string;
  status: string;
  message: string;
  sanitizedMessageHTML?: string;
  sanitizedMessageTxt?: string;
  first_observed: string;
  last_observed: string;
  source: any;
  config?: ConfigItem;
}

export type ConfigSummary = {
  type: string;
  analysis?: Record<string, any>;
  changes?: string;
  total_configs: number;
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
  agent?: {
    id: string;
    name: string;
  };
};
