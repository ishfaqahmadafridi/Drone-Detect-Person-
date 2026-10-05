"""Optional restricted-zone checks for individually detected people."""
class PipelineHazardEvaluator:
    @staticmethod
    def evaluate(zone_monitor, detected_persons):
        return zone_monitor.check_intrusions(detected_persons)
