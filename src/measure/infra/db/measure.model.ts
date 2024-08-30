import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

export type MeasureModelProps = {
  measureId: string;
  imageUri: string;
  customerCode: string;
  measureValue: number;
  hasConfirmed: boolean;
  measureType: "WATER" | "GAS";
  measureDateTime: Date;
};

@Table({ tableName: "measures", timestamps: false })
export class MeasureModel extends Model<MeasureModelProps> {
  @PrimaryKey
  @Column({ field: "measure_id", type: DataType.UUID })
  declare measureId: string;

  @Column({ field: "image_uri", type: DataType.STRING })
  declare imageUri: string;

  @Column({ field: "customer_code", type: DataType.STRING })
  declare customerCode: string;

  @Column({ field: "measure_value", type: DataType.FLOAT })
  declare measureValue: number;

  @Column({ field: "has_confirmed", type: DataType.BOOLEAN })
  declare hasConfirmed: boolean;

  @Column({ field: "measure_type", type: DataType.ENUM("WATER", "GAS") })
  declare measureType: "WATER" | "GAS";

  @Column({ field: "measure_date_time", type: DataType.DATE })
  declare measureDateTime: Date;
}
