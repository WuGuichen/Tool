from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class PluginConfig(Base):
    __tablename__ = "plugin_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plugin_name = Column(String, index=True)
    is_enabled = Column(Boolean, default=True)
    settings = Column(JSON, nullable=True)

    user = relationship("User", back_populates="plugin_configs")
